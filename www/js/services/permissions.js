angular.module("teamMusic")
    .factory('Permissions', function () {
        return {
            hasObjectPermission: function (user, object) {
                return (object.owner == user.id);
            },
            isEditor: function (user, playlist) {
                for (var i = 0; i < playlist.editors.length; i++) {
                    if (playlist.editors[i].id == user.id) {
                        return true;
                    }
                }
                return false;
            },
            isAdminEditor: function (user, playlist) {
                for (var i = 0; i < playlist.editors.length; i++) {
                    if (playlist.editors[i].id == user.id && playlist.editors[i].is_admin_editor) {
                        return true;
                    }
                }
                return false;
            }
        }
    })