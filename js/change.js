var url = new URL(window.location.href);
var person = url.searchParams.get("Person");
var amount = Number(url.searchParams.get("Amount"));
var webcourses = window.webcourses || {};

document.getElementById("personname").innerHTML = person;
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
    function ChangePersonAmount(newamount) {
        $.ajax({
            method: 'POST',
            url: _config.api.invokeUrl + '/addperson',
            headers: {
                Authorization: authToken
            },
            data: JSON.stringify({
                name: person,
                family_name: "",
                amount: newamount,
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
        console.log(result);
        window.location.href = 'people.html';
    }
    //+ должны мне. - должен я
    function HandleChangePersonAmount(event) {
        var amountdiff = $('#amountInput').val();
        var choice = document.querySelector('input[name="Choice"]:checked').id;
        switch (choice) {
            case "Choice1": //я занял
                amount -= Number(amountdiff);
                break;
            case "Choice2": //у меня заняли
                amount += Number(amountdiff);
                break;
            case "Choice3": //я вернул
                amount += Number(amountdiff);
                break;
            case "Choice4": //мне вернули
                amount -= Number(amountdiff);
                break;
        }
        event.preventDefault();
        ChangePersonAmount(amount);
    }

    $(function onDocReady() {
        $('#actionForm').submit(HandleChangePersonAmount);
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