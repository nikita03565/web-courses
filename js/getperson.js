/*global webcourses _config*/
var webcourses = window.webcourses || {};
(function rideScopeWrapper($) {
    var authToken;
    webcourses.authToken.then(function setAuthToken(token) {
        if (token) {
            authToken = token;
            alert(authToken);
        } else {
            window.location.href = 'signin.html';
        }
    }).catch(function handleTokenError(error) {
        window.location.href = 'signin.html';
    });
    function AddPerson(name, family_name) {
        $.ajax({
            method: 'POST',
            url: 'https://ee9gel1fi5.execute-api.us-east-2.amazonaws.com/prod/addperson',
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

    /*function AddPerson(name, family_name) {
        var xhr = new XMLHttpRequest();
        var url = _config.api.invokeUrl + '/addperson';
        //alert(url);
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Authorization", authToken);
        xhr.setRequestHeader("Content-Type", "application/json");
        var data = JSON.stringify({"name": name, "family_name": family_name, amount: 0});
        xhr.send(data);
        //alert(data);
        //alert(xhr.header);
        //alert(xhr.data);
        if (xhr.status !== 200) {
            alert("wut");
            alert( xhr.status + ': ' + xhr.statusText ); // пример вывода: 404: Not Found
        } else {
            // вывести результат
            alert( xhr.responseText ); // responseText -- текст ответа.
        }
    }*/

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
