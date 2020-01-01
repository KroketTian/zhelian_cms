let permissionsToIdList = (permissions) => {
    var getPermissionsIdList = function(permissions){
        let re = [];
        for(let permissionI in permissions){
            let childRe = getPermissionsIdList(permissions[permissionI].subPermissions);
            re = re.concat(childRe);
            re.push(permissions[permissionI].id)
        }
        return re
    }
    return getPermissionsIdList(permissions);
    // var getPermissionsIdList = [];
    // for(let i in permissions){
    //     getPermissionsIdList.push(permissions[i].id)
    // }
    // return getPermissionsIdList
}
export { permissionsToIdList }