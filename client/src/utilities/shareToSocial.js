/**
 * Opens a new tab to share content on a specified social media platform.
 *
 * @param {string} platform - The platform to share on.
 * @param {string} eventName - The title or name of the event to share.
 * @param {string} eventDescription - The description of the event to share.
 *
 * @returns {void}
 * @note This function opens a new browser tab/window with the share link.
 */

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