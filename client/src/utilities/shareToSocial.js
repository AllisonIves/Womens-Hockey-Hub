function shareToSocial(platform, eventName, eventDescription){
    let postText = eventName + " | " + eventDescription;
    let encodedText = encodeURIComponent(postText);
    let shareUrl = "";

    switch (platform) {
        case "x":
            shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
            break;
        case "facebook":
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedText}`;
            break;
        case "reddit":
            shareUrl = `https://www.reddit.com/submit?title=${encodedText}`;
            break;
        default:
            return;
        }
    window.open(shareUrl, "_blank", "width=600","height=400");
};
export default shareToSocial;