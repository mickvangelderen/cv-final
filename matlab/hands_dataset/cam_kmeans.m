clear cam;
cam = webcam;
cam.Resolution = '160x120';

while cam.isvalid
    I = im2double(cam.snapshot);
    pix = reshape(I, [], 3);
    yiq = rgb2lab(pix);
    % repeat the clustering 3 times to avoid local minima
    [lab, cen] = kmeans(yiq(:, 2:3), 8, 'distance', 'sqEuclidean');
    labs = unique(lab);
    col = zeros(length(labs), 3);
    for il = 1:length(labs)
        col(il, :) = mean(pix(lab == labs(il), :));
    end
    imshow(reshape(lab, size(I, 1), size(I, 2)), col);
end