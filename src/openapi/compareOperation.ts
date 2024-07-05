interface ComparableOperation {
  path: string;
  method: string;
}

export default function compareOperation(a: ComparableOperation, b: ComparableOperation): number {
  const nameCompare = a.path.localeCompare(b.path);
  if (nameCompare !== 0) {
    return nameCompare;
  }

  const methodOrder = ["get", "post", "put", "patch", "delete"];
  const aMethodIndex = methodOrder.indexOf(a.method);
  const bMethodIndex = methodOrder.indexOf(b.method);
  return aMethodIndex - bMethodIndex;
}