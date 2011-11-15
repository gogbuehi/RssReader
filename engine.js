var ContentManager = {
    jTemplate:null,
    init:function() {
        //Grab the template
        this.jTemplate = $("div#template");
        
        //Go grab the JSON content
        $.getJSON('RssProcessor.php',ContentManager.PROCESS_AND_RENDER_RESPONSE);
    },
    /**
     * CONTEXT-LESS METHOD
     * Treat this like a static method. 
     */
    PROCESS_AND_RENDER_RESPONSE:function(data) {
        var jClone;
        for (var i = 0; i < data.count; i++) {
            jClone = $(ContentManager.jTemplate.clone());
            jClone.attr("id","item_"+i);
            jClone.addClass("content_item");
            //Do this first; We could be more specific with a class
            if (data[i].image_src=="none") {
                $('<div class="placeholder"><span>No Image</span></div>').insertBefore(jClone.find('img'));
                jClone.find('img').remove();
            }
            jClone.find('img')
            .attr('src',data[i].image_src)
            .attr('width',data[i].image_width)
            .attr('height',data[i].image_height)
            .attr('alt',data[i].image_alt)
            .attr('title',data[i].image_alt);
            jClone.find('a.title').html(data[i].title[0]);
            jClone.find('a.title').attr('href',data[i].link);
            jClone.find('h2').html(data[i].creator[0]);
            jClone.find('p.article_description').html(data[i].description);
            jClone.find('footer').html(data[i].keywords);
                
            jClone.appendTo('body');
        }
    }
    
}
$(document).ready(function() {
    ContentManager.init();
});