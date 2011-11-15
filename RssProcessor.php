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
        /*
         * This could use $_GET, $_POST, or $_REQUEST to change the URL,
         * but for this exercise, I've hard-coded it, for simplicity.
         * Were I to use some form of dynamic RSS request, I would consider
         * implementing a distinct protocol, to ensure this page is not used
         * by others for unintended purposes.
         * Furthermore, this could all be done with static methods, as there
         * isn't an imperative need for OOP for this task
        */
        $rawRss = self::getFeed('http://feeds.nytimes.com/nyt/rss/HomePage');
        $parsedRss = self::parseRss($rawRss);
        self::renderResponse($parsedRss);
        
    }

    static function getFeed($url) {
        return file_get_contents($url);
    }

    static function &parseRss($rawRss) {
        return new SimpleXmlElement($rawRss);
    }

    static function renderResponse($parsedRss) {
        header('Content-type: application/json');
        $feedArray = array();
        foreach ($parsedRss->channel->item as $entry) {
            //Use that namespace
            $pheedo = $entry->children('http://www.pheedo.com/namespace/pheedo');
            $dc = $entry->children('http://purl.org/dc/elements/1.1/');
            $media = $entry->children('http://search.yahoo.com/mrss/');

            $link = $pheedo->origLink . "";

            $keywords = '';
            $delimiter = '';
            foreach ($entry->category as $category) {
                $keywords .= $delimiter . $category;
                $delimiter = ', ';
            }

            if (count($media->content) > 0) {
                $imageAttr = $media->content->attributes();

                $imageAlt = $media->description . "";

                $imageSrc = $imageAttr['url'] . "";
                $imageWidth = $imageAttr['width'] . "";
                $imageHeight = $imageAttr['height'] . "";
            } else {
                $imageSrc = "none";
                $imageWidth = "";
                $imageHeight = "";
                $imageAlt = "No Image";
            }
            $description = self::removeAds($entry->description);
            array_push($feedArray, array(
                'title' => $entry->title,
                'description' => $description,
                'creator' => $dc->creator,
                'keywords' => $keywords,
                'link' => $link,
                'image_src' => $imageSrc,
                'image_width' => $imageWidth,
                'image_height' => $imageHeight,
                'image_alt' => $imageAlt
            ));
        }
        $feedArray['count'] = count($feedArray);
        echo json_encode($feedArray, JSON_FORCE_OBJECT);
    }
    
    static function removeAds($description) {
        $adBreakArray = explode("<br clear=\"both\"", $description);
        return $adBreakArray[0];
    }

}
new RssProcessor();
?>