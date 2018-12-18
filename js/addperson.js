/*global webcourses _config*/
var webcourses = window.webcourses || {};
(function webcoursesScopeWrapper($) {
    var authToken;
    webcourses.authToken.then(function setAuthToken(token) {
        if (token) {
            authToken = token;
        } else {
            window.location.href = 'signin.html';
        }
    }).catch(function handleTokenError(error) {
        window.location.href = 'signin.html';
    });
    function AddPerson(name, family_name) {
        $.ajax({
            method: 'POST',
            url: _config.api.invokeUrl + '/addperson',
            headers: {
                Authorization: authToken
            },
            data: JSON.stringify({
                name: name,
                family_name: family_name,
                amount: 0
            }),
            //dataType: 'text',
            contentType: 'application/json',
            success: completeRequest,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                alert('An error occured when adding new person:\n' + jqXHR.responseText);
            }
        });
    }

    function completeRequest(result) {
        window.location.href = 'people.html';
    }

    function handleAddPerson(event) {
        var name = $('#nameInputRegister').val();
        var family_name = $('#familyNameInputRegister').val();
        event.preventDefault();
        AddPerson(name, family_name);
    }

    // Register click handler for #request button
    $(function onDocReady() {
        $('#addPersonForm').submit(handleAddPerson);
        $('#signOut').click(function() {
            webcourses.signOut();
            alert("You have been signed out.");
            window.location = "signin.html";
        });

        webcourses.authToken.then(function updateAuthMessage(token) {
            if (token) {
                displayUpdate('You are authenticated. Click to see your <a href="#authTokenModal" data-toggle="modal">auth token</a>.');
                $('.authToken').text(token);
            }
        });

        if (!_config.api.invokeUrl) {
            $('#noApiMessage').show();
        }
    });

    function displayUpdate(text) {
        $('#updates').append($('<li>' + text + '</li>'));
    }
}(jQuery));
