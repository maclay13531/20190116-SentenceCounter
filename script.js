$(document).ready(function () {
    $("#textarea-submit").submit(function (e) {
        e.preventDefault();
        var userSubmitedContent = $("#textarea-submit textarea").val().toUpperCase();
        console.log(userSubmitedContent);
        var letterCountDict = {
            "non-alphabet": 0
        };

        for (let i = 0; i < userSubmitedContent.length; i++) {
            if (userSubmitedContent[i].match(/[a-z]/i)) {
                if (letterCountDict.hasOwnProperty(userSubmitedContent[i]) === false) {
                    letterCountDict[userSubmitedContent[i]] = 1;
                } else {
                    letterCountDict[userSubmitedContent[i]]++;
                }
            } else {
                letterCountDict["non-alphabet"]++;
            }           
        }

        for (var key in letterCountDict) {
            $("#result-panel ul").append("<li>" + key + " : " + letterCountDict[key] + "</li>");
        }
    });
});