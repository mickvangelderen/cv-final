% Apply skin model from ``Statistical Color Models with Application to Skin
% Detection''
skin_model

clear cam
cam = webcam;

while cam.isvalid
    I = double(cam.snapshot);
    pixels = reshape(I, [], 3);
    probs = zeros(size(pixels, 1), 1);
    for ig = 1:length(MEANS)
        probs = probs + WEIGHTS(ig)*mvnpdf(pixels, MEANS(ig, :), COVS(ig, :));
    end
    O = reshape(probs, size(I, 1), size(I, 2));
    D = O > 10^-6.4;
    imshow(medfilt2(D, [7 7]));
end