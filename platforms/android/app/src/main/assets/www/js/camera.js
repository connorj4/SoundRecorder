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

    $(document).on("pageinit", "#camera", function(e) {
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