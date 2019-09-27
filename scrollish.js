var story_lookup = {};

function initStories() {
	var stories = document.querySelectorAll(".flourish-embed");
	for (var i = 0; i < stories.length; i++) {
		var story = stories[i];
		var id = story.dataset.src;
		story_lookup[id] = story;
		var h = story.getAttribute("data-height");
		story.style.top = "calc(50vh - " + h + "/2)";
	}
}

function initLinks() {
	var links = document.getElementsByTagName("a");
	for (var i = 0; i < links.length; i++) {
		var link = links[i],
		    href = link.getAttribute("href");
	
		// Ignore non-Flourish links
		if (!href || !href.match(/#story\/\d+/)) continue;

		// Get the ID and ignore if not;
		var id = href.split("/")[1];
		if (!story_lookup["story/" + id]) continue;
	
		var story_el = story_lookup["story/" + id];
		link.classList.add("fl-scrolly-link");
		link.addEventListener("click", function(e) {
			e.preventDefault();
			updateStoryFromLink(this);
		})
	}
}

function initIntersection() {
	var observer = new IntersectionObserver((entries, observer) => { 
		entries.forEach(entry => {
			if (entry.isIntersecting) updateStoryFromLink(entry.target);
		});
	}, { rootMargin: "0px 0px -50% 0px" });
	document.querySelectorAll(".fl-scrolly-step .fl-scrolly-link").forEach(function(link) {
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

function init() {
	initStories();
	initLinks();
	initIntersection();
}

init();
