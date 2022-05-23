import type { Lib } from 'vite-plugin-style-import';

import Antd from 'ant-design-vue';
import kebabize from '../utils/kebabize';

const replaceMap = {};

const allComponentNames = Object.keys(Antd);

allComponentNames.forEach((parentComponentName) => {
  const parentComponent = Antd[parentComponentName];
  Object.keys(parentComponent)
    .filter((subComponentName) => /^[A-Z][a-z]/.test(subComponentName))
    .forEach((subComponentName) => {
      const subComponent = parentComponent[subComponentName];
      allComponentNames.forEach((childComponentName) => {
        if (Antd[childComponentName] == subComponent) {
          replaceMap[kebabize(childComponentName)] = kebabize(parentComponentName);
        }
      })
    });
});

export function AntdStyleResolver(): Lib {
  return {
    ensureStyleFile: false,
    libraryName: 'ant-design-vue/lib',
    esModule: true,
    resolveStyle: (name) => {
      return `ant-design-vue/es/${replaceMap[name] || name}/style/index`;
    },
  };
}
