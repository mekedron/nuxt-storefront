import { ApolloLink } from '@apollo/client/core';

export default function createAuthLink() {
  return new ApolloLink((operation, forward) => {
    const { signInToken } = useUserStore();

    const headers = operation.getContext().headers || {};

    operation.setContext({
      headers: {
        ...headers,
        authorization: signInToken ? `Bearer ${signInToken}` : null,
      },
    });

    return forward(operation);
  });
}
