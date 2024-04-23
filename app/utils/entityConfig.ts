export type TEntityConfig = {
  type: string;
  value: any;
};
export type TEntityConfigCollection = TEntityConfig[];

/**
 * Return an entityconfig object by passing its key
 *
 * @param key The name of the entity config to return
 * @param entityConfig The unfiltered entity config object
 *
 * @returns TEntityConfig The entity config or undefined
 */
export const entityConfigFilter = (key: string, entityConfig: TEntityConfigCollection) => {
  const filteredEntityConfig: { [p: string]: any } = Object.keys(entityConfig)
    .filter(key => key.includes(key))
    .reduce((obj, key) => {
      return Object.assign(obj, {
        [key]: entityConfig[key],
      });
    }, {});

  return filteredEntityConfig[key] ?? [];
};
