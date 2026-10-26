let accessGranted = false;

export const grantCycleAccess = () => {
  accessGranted = true;
};

export const consumeCycleAccess = () => {
  const granted = accessGranted;
  accessGranted = false;
  return granted;
};

export const clearCycleAccess = () => {
  accessGranted = false;
};
