//Singleton Object
var FileManager = (function() {
    var instance;

    function createObject() {
        var audioMedia;
        var BASE_DIRECTORY = "CExhibition";
        var FILE_BASE = "file:///";

        return {
            copyFileToAppDirectory: function(filePath, cb) {
                var callback = {};

                callback.requestSuccess = function(dirEntry) {
                    if (filePath.indexOf(FILE_BASE) != 0) {
                        filePath = filePath.replace("file:/", FILE_BASE);
                    }

                    window.resolveLocalFileSystemURL(filePath, function(file) {
                        var filename = filePath.replace(/^.*[\\\/]/, '');

                        var copyToSuccess = function(fileEntry) {
                            console.log("file is copied to: " + fileEntry.toURL());
                            cb.copySuccess(fileEntry.toURL());
                        };

                        file.copyTo(dirEntry, filename, copyToSuccess, cb.copyError);
                    }, cb.copyError);
                };

                callback.requestError = function(error) {
                    console.log(error);
                };

                this.requestApplicationDirectory(callback);
            },
            requestApplicationDirectory: function(callback) {
                var fileSystemReady = function(fileSystem) {
                    fileSystem.root.getDirectory(BASE_DIRECTORY, { create: true }, callback.requestSuccess);
                };

                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemReady, callback.requestError);
            }
        };
    };

    return {
        getInstance: function() {
            if (!instance) {
                instance = createObject();
            }

            return instance;
        }
    };
})();
//Singleton Object
var CameraManager = (function() {
    var instance;

    function createObject() {
        var fileManager = FileManager.getInstance();

        return {
            getPicture: function(callback, fromGallery) {
                var source = Camera.PictureSourceType.CAMERA;

                if (fromGallery) {
                    source = Camera.PictureSourceType.PHOTOLIBRARY;
                }

                navigator.camera.getPicture(callback.onSuccess,
                    callback.onError, {
                        quality: 80,
                        destinationType: Camera.DestinationType.FILE_URI,
                        sourceType: source,
                        correctOrientation: true
                    });
            }
        };
    };

    return {
        getInstance: function() {
            if (!instance) {
                instance = createObject();
            }

            return instance;
        }
    };
})();

(function() {
    var cameraManager = CameraManager.getInstance();

    //$(document).on("pageinit", "#camera", function(e) {
    $(document).on("#camera", function(e) {
        e.preventDefault();

        $("#imageView").hide();

        $("#getPicture").on("tap", function(e) {
            e.preventDefault();

            $("#pictureTypeSelection").popup("open");
        });

        $("#pictureFromGallery").on("tap", function(e) {
            e.preventDefault();
            $("#pictureTypeSelection").popup("close");

            getPhoto(true);
        });

        $("#pictureFromCamera").on("tap", function(e) {
            e.preventDefault();
            $("#pictureTypeSelection").popup("close");

            getPhoto(false);
        });
    });

    function getPhoto(fromGallery) {
        var callback = {};

        callback.onSuccess = onSuccess;
        callback.onError = onError;

        cameraManager.getPicture(callback, fromGallery);
    }

    function onSuccess(fileURI) {
        $("#imageView").show();
        $("#imageView").attr("src", fileURI);
    }

    function onError(message) {
        console.log("Camera capture error");
    }
})();