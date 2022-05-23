import kebabCase from '../utils/kebabCase';
// @ts-ignore
import type { ComponentResolver, SideEffectsInfo } from 'unplugin-vue-components';
import Antd from 'ant-design-vue';

interface IMatcher {
  pattern: RegExp;
  styleDir: string;
}

export interface AntDesignVueResolverOptions {
  /**
   * exclude components that do not require automatic import
   *
   * @default []
   */
  exclude?: string[];
}

const antdComponentsHierarchy = {};

const isComponent = (name: string) => /^[A-Z][a-z]/.test(name);

const primitiveNames = Object.keys(Antd).filter(isComponent);

primitiveNames.forEach((parentComponentName) => {
  const parentComponent = Antd[parentComponentName];

  Object.keys(parentComponent)
    .filter(isComponent)
    .forEach((subComponentName) => {
      const subComponent = parentComponent[subComponentName];
      primitiveNames.forEach((childComponentName) => {
        if (Antd[childComponentName] == subComponent) {
          antdComponentsHierarchy[kebabCase(childComponentName)] = kebabCase(parentComponentName);
        }
      })
    });
});

const prefix = 'A';

let antdvNames: Set<string>;

function genAntdNames(primitiveNames: string[]): void {
  antdvNames = new Set(primitiveNames.map((name) => `${prefix}${name}`));
}

genAntdNames(primitiveNames);

function isAntdv(compName: string): boolean {
  return antdvNames.has(compName);
}

/**
 * Resolver for Ant Design Vue
 *
 * Requires ant-design-vue@v2.2.0-beta.6 or later
 *
 * See https://github.com/antfu/unplugin-vue-components/issues/26#issuecomment-789767941 for more details
 *
 * @author @yangss3
 * @link https://antdv.com/
 */
export function AntdComponentResolver(options: AntDesignVueResolverOptions = {}): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (isAntdv(name) && !options?.exclude?.includes(name)) {
        const componentName = name.slice(1);
        const kebabComponentName = kebabCase(componentName);
        const rootComponent = antdComponentsHierarchy[kebabComponentName] || kebabComponentName;
        // console.log({kebabComponentName, rootComponent});
        const path = `ant-design-vue/lib/${rootComponent}`;

        let importName = componentName;
        if (!antdComponentsHierarchy[kebabComponentName]) {
          importName = 'default';
        }

        return {
          name: importName,
          from: path,
          sideEffects: [
            // Rollup doesn't build less files....
            // and there is no way to add rollup plugin in nitro pack to add less support...........
            `ant-design-vue/es/${rootComponent}/style/index.css`
          ]
        };
      }
    },
  };
}
