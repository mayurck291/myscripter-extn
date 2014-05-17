var form = document.getElementById( 'file-form' );
var fileSelect = document.getElementById( 'file-select' );
var uploadButton = document.getElementById( 'upload-button' );

form.onsubmit = function ( event ) {
    event.preventDefault( );

    // Update button text.
    uploadButton.innerHTML = 'Uploading...';

    // The rest of the code will go here...
    // 
    var files = fileSelect.files;
    var formData = new FormData( );
    for ( var i = 0; i < files.length; i++ ) {
        var file = files[ i ];

        // Check the file type.
        if ( !file.type.match( 'image.*' ) ) {
            continue;
        }

        // Add the file to the request.
        formData.append( 'photos', file, file.name );
    }

    var xhr = new XMLHttpRequest( );

    xhr.open( 'POST', 'http://localhost:3000/saveRecipe', true );

    xhr.onload = function ( ) {
        if ( xhr.status === 200 ) {
            // File(s) uploaded.
            uploadButton.innerHTML = 'Upload';
        } else {
            alert( 'An error occurred!' );
        }
    };

    // xhr.onreadystatechange = function ( ) {
    //     if ( request.readyState == 4 && xmlhttp.status == 404 ) {
    //         alert( "Oh no, it does not exist!" );
    //     }
    //     console.log( xhr.readyState, )
    // }
    xhr.send( formData );
}
