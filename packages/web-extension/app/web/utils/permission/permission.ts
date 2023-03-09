export function getApplicationPermissions(permissions: any[], domain: string) {
  const indexList: number[] = [];
  const permissionsTemp = permissions.filter((permission, index) => {
    const domainCheck = permission.domain === domain;
    if (domainCheck) {
      indexList.push(index);
      return true;
    }
    return false;
  });
  return {
    permissions: JSON.parse(JSON.stringify(permissionsTemp)),
    indexList,
  };
}
