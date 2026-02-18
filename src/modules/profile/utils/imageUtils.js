/**
 * Creates a new HTMLImageElement from a source URL.
 */
export const createImage = (url) =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid CORS issues on CodeSandbox
        image.src = url;
    });

/**
 * Returns the new bounding area of a rotated rectangle.
 */
export function getRotatedRectSize(width, height, rotation) {
    const rotRad = (rotation * Math.PI) / 180;

    return {
        width:
            Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
        height:
            Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
    };
}

/**
 * Crops and resizes an image based on the crop area.
 * @param {string} imageSrc - The source image URL.
 * @param {object} pixelCrop - The pixel crop area { x, y, width, height }.
 * @param {number} rotation - The rotation in degrees (default 0).
 * @param {object} flip - The flip state { horizontal, vertical }.
 * @returns {Promise<Blob>} - The cropped image as a Blob.
 */
export default async function getCroppedImg(
    imageSrc,
    pixelCrop,
    rotation = 0,
    flip = { horizontal: false, vertical: false }
) {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        return null;
    }

    const rotRad = (rotation * Math.PI) / 180;

    // calculate bounding box of the rotated image
    const { width: bBoxWidth, height: bBoxHeight } = getRotatedRectSize(
        image.width,
        image.height,
        rotation
    );

    // set canvas size to match the bounding box
    canvas.width = bBoxWidth;
    canvas.height = bBoxHeight;

    // translate canvas context to a central location to allow rotating and flipping around the center
    ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
    ctx.rotate(rotRad);
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
    ctx.translate(-image.width / 2, -image.height / 2);

    // draw rotated image
    ctx.drawImage(image, 0, 0);

    // croppedAreaPixels values are bounding box relative
    // extract the cropped image using these values
    const data = ctx.getImageData(
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height
    );

    // set canvas width to final desired crop size - this will clear existing context
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // paste generated rotate image to the top left corner
    ctx.putImageData(data, 0, 0);

    // As Blob
    return new Promise((resolve, reject) => {
        canvas.toBlob((file) => {
            resolve(file);
        }, 'image/png'); // Default to PNG for signatures (transparency support if needed, though usually white bg)
    });
}

/**
 * Resizes an image (or canvas) to specific dimensions.
 * Useful if you want to enforce a max width/height for the stored signature.
 */
export const resizeImageBlob = async (blob, maxWidth, maxHeight) => {
    const url = URL.createObjectURL(blob);
    const image = await createImage(url);
    const canvas = document.createElement('canvas');
    let { width, height } = image;

    if (width > height) {
        if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
        }
    } else {
        if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
        }
    }

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, width, height);

    return new Promise((resolve) => {
        canvas.toBlob((newBlob) => {
            URL.revokeObjectURL(url);
            resolve(newBlob);
        }, 'image/png', 0.9);
    });
};
