var CLIPBOARD = new CLIPBOARD_CLASS("imageSrc", false);

/**
 * image pasting into canvas
 *
 * @param {string} canvas_id - canvas id
 * @param {boolean} autoresize - if canvas will be resized
 */
function CLIPBOARD_CLASS(canvas_id, autoresize) {
    var _self = this;
    var canvas = document.getElementById(canvas_id);
    var ctx = document.getElementById(canvas_id).getContext("2d");

    //handlers
    document.addEventListener('paste', function (e) { _self.paste_auto(e); }, false);

    //on paste
    this.paste_auto = function (e) {
        if (e.clipboardData) {
            var items = e.clipboardData.items;
            if (!items) return;

            //access data directly
            var is_image = false;
            for (var i = 0; i < items.length; i++) {
                if (items[i].type.indexOf("image") !== -1) {
                    //image
                    var blob = items[i].getAsFile();
                    var URLObj = window.URL || window.webkitURL;
                    var source = URLObj.createObjectURL(blob);
                    this.paste_createImage(source);
                    is_image = true;
                }
            }
            if(is_image == true){
                e.preventDefault();
            }
        }
    };
    //draw pasted image to canvas
    this.paste_createImage = function (source) {
        var pastedImage = new Image();
        pastedImage.onload = function () {
            if(autoresize == true){
                //resize
                canvas.width = pastedImage.width;
                canvas.height = pastedImage.height;
                ctx.drawImage(pastedImage, 0, 0);
            }
            else{
                //clear canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // set size proportional to image
                canvas.height = canvas.width * (pastedImage.height / pastedImage.width);
                // step 1 - resize to X%
                let prop = 1.0 // 0.5
                var oc = document.createElement('canvas'),
                    octx = oc.getContext('2d');
                oc.width = pastedImage.width * prop;
                oc.height = pastedImage.height * prop;
                octx.drawImage(pastedImage, 0, 0, oc.width, oc.height);
                // step 2
                octx.drawImage(oc, 0, 0, oc.width * prop, oc.height * prop);
                // step 3, resize to final size
                ctx.drawImage(oc, 0, 0, oc.width * prop, oc.height * prop,
                0, 0, canvas.width, canvas.height);

            }
        };
        pastedImage.src = source;
    };
};

function lines(thresh1, thresh2) {

  let canvas = document.getElementById('imageSrc');
  let ctx = canvas.getContext('2d');
  let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  let src = cv.matFromImageData(imgData);

  let dst = new cv.Mat();
  cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);
  cv.Canny(src, dst, thresh1, thresh2, 3, true);
  cv.bitwise_not(dst, dst)
  cv.imshow('canvasOutput', dst);
  src.delete(); dst.delete();
};


function hello() {
    console.log('main.js loaded')
};

