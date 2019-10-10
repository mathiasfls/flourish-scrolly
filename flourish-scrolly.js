function initStories() {
	var stories = document.querySelectorAll(".flourish-embed");
	// TODO Ignore non-story embeds
	for (var i = 0; i < stories.length; i++) {
		var story = stories[i],
		    id = story.dataset.src.split("/")[1],
		    h = story.getAttribute("data-height") || "75vh",
		    last_link = last_link_per_story["story-" + id],
		    common_parent = commonAncestor(story, last_link);

		story.id = "story-" + id;

		var target_div = document.createElement("div");
		target_div.classList.add("fl-scrolly-section");
		target_div.style.position = "relative";
		target_div.style.paddingBottom = "1px";
		target_div.id = "fl-scrolly-section-" + id;

		common_parent.classList.add("fl-scrolly-parent-" + id);

		var children = document.querySelectorAll(".fl-scrolly-parent-" + id + " > *");
		story.__found_story__ = false;
		for (var j = 0; j < children.length; j++) {
			var child = children[j];
			if (story.__found_story__) {
				target_div.appendChild(child);
				if (child.querySelector(".fl-scrolly-last-link-story-" + id)) break;
			}
			else {
				var embed = child.id == "story-" + id || child.querySelector("#story-" + id);
				if (embed) {
					story.__found_story__ = true;
					child.style.top = "calc(50vh - " + h + "/2)";
					child.classList.add("fl-scrolly-sticky");
					common_parent.insertBefore(target_div, child);
					target_div.appendChild(child);
				}
			}
		}
	}
}

var last_link_per_story = {};
function initLinks() {
	var links = document.getElementsByTagName("a");
	for (var i = 0; i < links.length; i++) {
		var link = links[i],
		    href = link.getAttribute("href");

		// Ignore non-Flourish links
		if (!href || !href.match(/#story\/\d+/)) continue;

		// // Get the ID and set classes
		var id = href.split("/")[1];
		last_link_per_story["story-" + id] = link;
		link.classList.add("fl-scrolly-link");
		link.classList.add("story-" + id);
		link.parentNode.classList.add("fl-scrolly-step");

		link.addEventListener("click", function(e) {
			e.preventDefault();
			updateStoryFromLink(this);
		});
	}
	for (var link in last_link_per_story) {
		last_link_per_story[link].classList.add("fl-scrolly-last-link-" + link);
	}
}

function initIntersection() {
	var observer = new IntersectionObserver(function(entries, observer) {
		entries.forEach(function(entry) {
			if (entry.isIntersecting) updateStoryFromLink(entry.target);
		});
	}, { rootMargin: "0px 0px -50% 0px" });
	document.querySelectorAll(".fl-scrolly-link").forEach(function(link) {
		return observer.observe(link);
	});
}

function updateStoryFromLink(el) {
	var link_array = el.getAttribute("href").split("/");
	var slide_number = parseFloat(link_array[link_array.length - 1].replace("slide-", ""));
	var slide_id = slide_number - 1;
	var iframe = el.parentElement.parentElement.querySelector(".flourish-embed iframe"); // TODO: Recursive parent search
	iframe.src = iframe.src.replace(/#slide-.*/, "") + "#slide-" + slide_id;
}


function parents(node) {
	var nodes = [node]
	for (; node; node = node.parentNode) {
		nodes.unshift(node)
	}
	return nodes;
}

function commonAncestor(node1, node2) {
	var parents1 = parents(node1);
	var parents2 = parents(node2);
	if (parents1[0] != parents2[0]) throw "No common ancestor!";
	for (var i = 0; i < parents1.length; i++) {
		if (parents1[i] != parents2[i]) return parents1[i - 1]
	}
}

function initStyles() {
	// TODO. The user should be able to override these!
	var style = document.createElement("style");
	style.innerHTML = "" +
		".fl-scrolly-sticky {" +
			"position: -webkit-sticky;" +
			"position: sticky;" +
		"}" +
		".fl-scrolly-section .fl-scrolly-step {" +
			"position: relative;" +
			"width: 50%;" +
			"margin: 0 auto 50vh;" +
			"padding: 1.25em;" +
			"background: #333;" +
			"box-shadow: 3px 3px 5px rgba(0,0,0,0.1);" +
			"font-family: Helvetica, sans-serif;" +
			"border-radius: 10px;" +
			"opacity: 0.95;" +
			"text-align: center;" +
			"transform: translate3d(0,0,0); /* Workaround for Safari https://stackoverflow.com/questions/50224855/not-respecting-z-index-on-safari-with-position-sticky */" +
		"}" +
		".fl-scrolly-section .fl-scrolly-step a {" +
			"color: inherit;" +
		"}";
	document.body.appendChild(style);
}

function init() {
	initLinks(); // Find suitable links and add styles and click handlers
	initStories(); // Find embedded stories and reorganise the DOM around them
	initIntersection(); // Initialise the scrolly triggers
	initStyles(); // Add a stylesheet with required styles
}
init();
