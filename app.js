
$(document).ready(() =>{
    $('body').hide();
    $('body').show('fade', 2000);
    $('#dialog').dialog();

    $('#importJson').click(function(){
        let word = $('#word').val();
        let browser = $('#browser');
        let container = $('#info');
        container.html("");


        $.ajax({

            type: 'GET',
            url:'https://api.dictionaryapi.dev/api/v2/entries/en/'+word,
            dataType:'json'

        }).done((results) => {

            container.hide();
            
            $.each(results, function(i, item){
                $('#word').val('');
                container.append("<div id='display"+ i +"'></div>");
                let displayWord = $('#display'+i);

                displayWord.append("<div id='results"+ i +"'></div>");
                let list = $('#results'+ i);
                
                list.append('<div id="titleBanner'+i+'"><h3 class="wordTitle">'+ item.word +'</h3></div>');
                
                let titleBanner = $('#titleBanner'+i);
                titleBanner.addClass('titleBanner');
                if(item.phonetics[0].hasOwnProperty('text')){
                    titleBanner.append('<div id="phonetics"><p>['+item.phonetic+']</p></div>');
                    titleBanner.append('<div id="audio"><audio controls><source src="'+item.phonetics[0].audio+'" type="audio/mpeg">Your browser does not support the audio element.</audio></div>');

                }

                //Comprueba si existe el campo en el objeto
                if(item.hasOwnProperty('origin')){
                    list.append("<div class='wordOrigin'><strong>Origin: </strong>"+ item.origin +"</div>");
                }
                
                let meanings = item.meanings;

                displayWord.append("<div id='meaning"+i+"'><ul></ul></div>");
                let meaningDisplay = $('#meaning'+i);
                let meaningTabs = $('#meaning'+i+' ul');
                
                $.each(meanings, function(j, meaning){
                    meaningTabs.append("<li><a href='#definitions"+ i + j +"'>"+ meaning.partOfSpeech+"</a></li>");
                    meaningDisplay.append("<div id='definitions"+ i + j +"'></div>");
                    
                    let definitionDisplay = $('#definitions'+i+j);
                    let definitions = meaning.definitions;

                    $.each(definitions, function(k, definition){
                        definitionDisplay.append("<div id='definition"+ j + k +"'><p><span>"+ (k+1) +". </span>"+ definition.definition +"</p></div>");
                        definitionDisplay.append("<div id='buttons"+j+k+"'></div>");
                        let buttonsDisplay = $('#definition'+j+k);
                        buttonsDisplay.addClass('definition');
                             
                        //Ejemplos
                        if(definition.hasOwnProperty('example')){
                            buttonsDisplay.append("<a id='exampleToggle"+j+k+"'>View example</a>");
                            let exampleButton = $('#exampleToggle'+j+k);
                            exampleButton.addClass('optionsButton');
                            
                            buttonsDisplay.append("<div id='exampleTitle"+j+k+"'></div>");
                            let exampleTitle = $('#exampleTitle'+j+k);
                            exampleTitle.hide();
                            exampleTitle.addClass('exampleTitle');
                            exampleTitle.append("<p id='example"+j+k+"'>"+definition.example+"</p>");
    
                            exampleButton.on("click", function(){
                                exampleTitle.toggle('blind', 200);
                            });
                        }

                        //Sinónimos
                        if(definition.synonyms != ""){
                            buttonsDisplay.append("<a id='synonymsToggle"+j+k+"'>View synonyms</a>");
                            let synonymsButton = $('#synonymsToggle'+j+k);
                            synonymsButton.addClass('optionsButton');
                            
                            buttonsDisplay.append("<div id='synonymsTitle"+j+k+"'></div>");
                            let synonymsTitle = $('#synonymsTitle'+j+k);
                            synonymsTitle.hide();
                            synonymsTitle.addClass('synonymsTitle');
                            synonymsTitle.append("<p id='synonyms"+j+k+"'>"+definition.synonyms+"</p>");
    
                            synonymsButton.on("click", function(){
                                synonymsTitle.toggle('blind', 200);

                            });
                        }
                    });
                });

                meaningDisplay.tabs();
            });

            container.show("drop");

        }).fail(() => {
            container.html("");
            browser.effect("shake");
            container.append('<small>Word not found</small>');
        });
    });

});
