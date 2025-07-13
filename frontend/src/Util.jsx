export function getBase64(file, onGetResult) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        onGetResult(reader.result)
    };
    reader.onerror = function (error) {
        console.log('error: ', error);
    };

}