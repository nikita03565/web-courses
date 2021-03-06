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
    function GetPerson() {
        $.ajax({
            method: 'POST',
            url: _config.api.invokeUrl + '/people',
            headers: {
                Authorization: authToken
            },
            data: JSON.stringify({
            }),
            //dataType: 'text',
            contentType: 'application/json',
            success: completeRequest,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                alert('An error occured when getting persons:\n' + jqXHR.responseText);
            }
        });
    }

    function completeRequest(result) {
        var text = "";
        var i = 0;
        var phrase = '';
        result.forEach(function(element, index, array) {
            if (Number(element.Amount) > 0) {
                phrase = " должен мне "
            } else {
                phrase = " я должен "
            }
            text += "<div id='id" + i + "'><a href='change.html?Person=" + element.Person + '&Amount=' + element.Amount + "'>" + element.Person  + "</a>:" + phrase + Math.abs(element.Amount) + "</div>";
            i += 1;
        });
        text += "";
        document.getElementById("target").innerHTML = text;
    }

    $(function onDocReady() {
        GetPerson();
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
