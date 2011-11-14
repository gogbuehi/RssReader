<?php

header('Content-type: application/json');
$feed = file_get_contents('http://feeds.nytimes.com/nyt/rss/HomePage');
$xml = new SimpleXmlElement($feed);
$feedArray = array();
foreach ($xml->channel->item as $entry) {
    //Use that namespace
    $pheedo = $entry->children('http://www.pheedo.com/namespace/pheedo');
    $dc = $entry->children('http://purl.org/dc/elements/1.1/');
    $media = $entry->children('http://search.yahoo.com/mrss/');

    $link = $pheedo->origLink."";

    $keywords = '';
    $delimiter = '';
    foreach ($entry->category as $category) {
        $keywords .= $delimiter . $category;
        $delimiter = ', ';
    }

    if (count($media->content) > 0) {
        $imageAttr = $media->content->attributes();
        
        $imageAlt = $media->description."";
        
        $imageSrc = $imageAttr['url']."";
        $imageWidth = $imageAttr['width']."";
        $imageHeight = $imageAttr['height']."";
    } else {
        $imageSrc = "none";
        $imageWidth = "";
        $imageHeight = "";
        $imageAlt = "No Image";
    }
    //echo $imageHeight."\n";
    $adBreakArray = explode("<br clear=\"both\"", $entry->description);
    
    $description=$adBreakArray[0];
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
    //echo $link."\n";
    //echo $keywords."\n";
}
$feedArray['count'] = count($feedArray);
echo json_encode($feedArray, JSON_FORCE_OBJECT);

?>