var NyTimesRssEngine = {
    jItems:null,
    currentItem:null,
    init:function() {
        this.jItems = $("div.content_item");
        if(this.jItems.length > 0) this.currentItem = 0;
        this.jItems.each(this.STACK_ITEMS);
    },
    getIndexOf:function(selector) {
        return this.jItems.index(selector);
    },
    getItemAt:function(index) {
        return $(this.jItems.get(index));
    },
    getCurrentItem:function() {
        return this.getItemAt(this.currentItem);
    },
    previous:function() {
        this.getItemAt(
            ((this.currentItem) == 0) ?
            this.getCount()-1:
            this.currentItem-1
            ).click();
    },
    next:function() {
        this.getItemAt(
            ((this.currentItem+1) == this.getCount()) ?
            0:
            this.currentItem+1
            ).click();
    },
    /**
     * Get the number of RSS items
     */
    getCount:function() {
        return this.jItems.length;
    },
    getRelativeTopPosition:function(index) {
        //Top-Most Item
        var pItem = this.getItemAt(0);
        var pPos = pItem.offset();
        //Item to get relative top position for
        var cItem = this.getItemAt(index);
        var pos = cItem.position();
        
        var topPlus = pPos.top+(300*index);
        console.log("Index " + index);
        console.log("topPlus: " + topPlus);
        console.log("pos.top: " + pos.top);
        console.log(": " + (topPlus-pos.top));
        //return (topPlus-pos.top);
        return 0;
    },
    newCurrentItem:function(index) {
        //Put the old "currentItem" away
        var jCurrentItem = this.getCurrentItem();
        jCurrentItem.animate({
            width:750
        },250);
        jCurrentItem.css("z-index",this.getCount()-this.currentItem);
        this.currentItem = index;
    },
    //CONTEXT-LESS METHODS
    STACK_ITEMS:function(index,element) {
        var jObject = $(element);
        if (index == NyTimesRssEngine.currentItem) {
            jObject.addClass("current");
        }
        jObject.css("z-index",NyTimesRssEngine.getCount()-index);
        if (index != 0) {
            
            jObject.animate({
                top:NyTimesRssEngine.getRelativeTopPosition(index)
            },{
                queue:true,
                duration:500
            });
            
        } else {
            jObject.css("top",0);
        }
        
        jObject.click(NyTimesRssEngine.GO_TO_ITEM);
        
    },
    GO_TO_ITEM:function() {
        
        //TODO: Call an instance method
        if (NyTimesRssEngine.getIndexOf(this)!=NyTimesRssEngine.currentItem) {
        
            var jNextItem = $(this);
            var nextTopPos = jNextItem.position().top;
            var cssTopPos = parseInt(jNextItem.css("top"));
            cssTopPos = (isNaN(cssTopPos) ? 0 : cssTopPos);
            jNextItem.animate({
                width:800
            },250,function() {
                //First Animation Complete
                var jNextItem = $(this);
                var nextItemIndex = NyTimesRssEngine.getIndexOf(this);
                var jCurrentItem = NyTimesRssEngine.getCurrentItem();
            
                jCurrentItem.removeClass("current");
                //jObject.css("z-index",NyTimesRssEngine.getCount()-index);
                jNextItem.addClass("current");
                jNextItem.css("z-index",NyTimesRssEngine.getCount()+1);
                NyTimesRssEngine.newCurrentItem(nextItemIndex);
                jNextItem.animate({
                    top:NyTimesRssEngine.getRelativeTopPosition(nextItemIndex)
                //top:NyTimesRssEngine.getRelativeTopPosition(0)
                },250,function() {
                    window.location.hash = '#anchor_'+ $(this).attr("id");
                })
               ;
            });
        }
    }
}

var KeyManager = {
    init:function() {
        $(document).keyup(KeyManager.KEY_UP);
    //$(document).keydown(KeyManager.KEY_DOWN);
    //$(document).keypress(KeyManager.KEY_PRESSED);
    },
    KEYCODE_ENTER:13,
    KEYCODE_BACKSPACE:8,
    KEYCODE_SPACEBAR:32,
    KEYCODE_TAB:9,
    KEYCODE_UP:38,
    KEYCODE_DOWN:40,
    KEYCODE_LEFT:37,
    KEYCODE_RIGHT:39,
    KEYCODE_SHIFT:16,
    KEY_UP:function(event) {
        //console.log("keyup: " + event.keyCode);
        switch(event.keyCode) {
            case KeyManager.KEYCODE_UP:
                NyTimesRssEngine.previous();
                break;
            case KeyManager.KEYCODE_DOWN:
                NyTimesRssEngine.next();
                break;
            default:
        //Do Nothing for now
        }
        return false;
    },
    KEY_DOWN:function(event) {
    //console.log("keydown: " + event.keyCode);
    },
    KEY_PRESSED:function(event) {
    //console.log("keypressed: " + event.keyCode);
    //console.log("Actual char: " + String.fromCharCode(event.keyCode));
    }
}
var ContentManager = {
    jTemplate:null,
    rssJson:null,
    init:function() {
        //Grab the template
        this.jTemplate = $("div#template");
        
        //Go grab the JSON content
        $.getJSON('retrieve_rss.php',function(data) {
            ContentManager.rssJson = data;
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
                jClone.find('a.scroll_anchor').attr("id","anchor_item_"+i);
                jClone.find('a.title').html(data[i].title[0]);
                jClone.find('a.title').attr('href',data[i].link);
                jClone.find('h2').html(data[i].creator[0]);
                jClone.find('p.article_description').html(data[i].description);
                jClone.find('footer').html(data[i].keywords);
                
                jClone.appendTo('body');
            }
            
            NyTimesRssEngine.init();
            KeyManager.init();
        });
        
        
        
    }
    
}
$(document).ready(function() {
    //NyTimesRssEngine.init();
    //KeyManager.init();
    ContentManager.init();
});