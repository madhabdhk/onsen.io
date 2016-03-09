(function() {
  var el, container, emailInput;
  var body, html, height;
  var oneDay = 1000 * 60 * 60 * 24;
  var defaultPopupDelay = 15000;
  var scrollPopupDelay = 1000;
  var popup = ["popup-newsletter", "popup-google-maps", "popup-material-design"];

  function checkScrollPosition(e) {
    body = document.body;
    html = document.documentElement;
    height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);

    if (window.scrollY > height/2) {
      checkPopup(scrollPopupDelay);
      document.removeEventListener("scroll", checkScrollPosition);
    }
  }

  function onPopupClose(e) {
    container.classList.add("pop-container-hidden");
    document.body.style.position = "";
    document.body.style.overflow = "scroll";

    el.removeEventListener(transitionEvent, onPopupClose);
    document.removeEventListener("click", hidePopup);
  }


  function setLocalStorage(popupName, now, days) {
    var expireDate =  now + (oneDay * days);

    localStorage.setItem(popupName + ".expireDate", expireDate);
    localStorage.setItem("latestUpdate", now);
  }

  function hidePopup(e) {
    var target = e.target;
    var delay = 0;
    emailInput = el.getElementsByTagName("input")[0].value;

    if (target === container || target.classList.contains("pop-button-close") || (target.id === "button-submit" && emailInput)) {
      if (e.target.id === "button-submit") {
        delay = delay + 1000;
      }

      setTimeout(function() {
        container.classList.add("pop-container-hidden");
        document.body.style.position = "";
        document.body.style.overflow = "scroll";
        el.classList.add("pop-hidden");
      }, delay);
    }
  }

  function canUpdateStorage(popupName, now) {
    var latestStorageUpdate = parseInt(localStorage.getItem("latestUpdate"));
    var latestPopupUpdate = parseInt(localStorage.getItem(popupName + ".expireDate"));

    return (!latestStorageUpdate || ((latestPopupUpdate - now <= 0) && (latestStorageUpdate + oneDay - now <= 0)));
  }

  function showPopup(popupName, now) {
    el = document.getElementById(popupName);
    container = document.getElementById("popup-container");

    setLocalStorage(popupName, now, 30);
    el.classList.remove("pop-hidden");
    container.classList.remove("pop-container-hidden");
    document.body.style.overflow = "hidden";

    if (isMobile()) {
      el.classList.add("pop-mobile");
      document.body.style.position = "fixed";
      emailInput = el.getElementsByTagName("input")[0];
      emailInput.style.width = "200px";
    } else {
      el.classList.add("pop-desktop");
    }
  }

  function isMobile() {
    return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
  }

  function checkPopup(delay) {
    if (typeof(Storage) !== "undefined") {
      setTimeout(function() {
        var now = new Date().getTime();
        var popupName;

        for (var i in popup) {
          popupName = popup[i];
          if (canUpdateStorage(popupName, now)) {
            showPopup(popupName, now);
            document.addEventListener("click", hidePopup, false);
            return;
          }
        }
      }, delay);
    }
  }

  function checkPopupEvent(e) {
    checkPopup(defaultPopupDelay);
    document.removeEventListener(e.type, checkPopupEvent);
  }

  document.addEventListener("DOMContentLoaded", checkPopupEvent);

  document.addEventListener("scroll", checkScrollPosition);
})();