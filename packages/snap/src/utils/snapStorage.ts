export const addReputation = async (_source: string, id_obj: string): Promise<string> => {
  
  let state = {"facebook":"","twitter":""};
  if (_source == "facebook") {
    let twitterobj = await getReputation("twitter");
    state = {"facebook":id_obj,"twitter":twitterobj};
  }
  else if (_source == "twitter") {
    let facebookobj = await getReputation("facebook");
    state = {"facebook":facebookobj,"twitter":id_obj};
  }

  // Persist some data.
  snap.request({
    method: 'snap_manageState',
    params: { operation: 'update', 
    newState: state
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
    if (a && a[_source])
      return a!![_source];
    else
      return "";
    //return JSON.stringify(a!![_source]);
  });

  return persistedData?.toString()!;
}

export const getAllReputations = (): any => {
  // to be implemented
}