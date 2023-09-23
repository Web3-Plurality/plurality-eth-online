export const addReputation = (_source: string, id_obj: string): string => {
  
  // Persist some data.
  snap.request({
    method: 'snap_manageState',
    params: { operation: 'update', 
    newState: {[_source] : id_obj}
    }
  });
  return id_obj;
}

export const getReputation = async (_source: string): Promise<string> => {
  // At a later time, get the data stored.
  const persistedData = await snap.request({
    method: 'snap_manageState',
    params: { operation: 'get' },
  }).then((a)=> {
    return a!![_source];
    //return JSON.stringify(a!![_source]);
  });

  return persistedData?.toString()!;
}

export const getAllReputations = (): any => {
  // to be implemented
}