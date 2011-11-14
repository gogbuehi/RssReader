<?php
/**
 * Description of RssProcessor
 * 
 * Receive requests for an RSS Feed and processes it for use by a local JS
 * renderer.
 *
 * @author goodwin
 */
class RssProcessor {
    
    function __construct() {
        
        
    }
    function getFeed($url) {
        
    }
    function parseRss($rawRss) {
        
    }
    function renderResponse($parsedRss) {
        header('Content-type: application/json');
    }
}

?>
