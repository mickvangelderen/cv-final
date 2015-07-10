clear cam;
cam = webcam;
cam.Resolution = '160x120';
hscharr = [3 10 3]'*[-1 0 1];
hblur = fspecial('gauss', [20 20], 10);

B = im2double(cam.snapshot);

while cam.isvalid
    I = gpuArray(im2double(cam.snapshot));
    Igray = mean(I, 3);
    Idx = imfilter(Igray, hscharr);
    Idy = imfilter(Igray, hscharr');
    Idxy = abs(Idx) + abs(Idy);
    Iskin = detect_skin(I);
    Iedge = imfilter(Iskin.*Idxy, hblur);
% Find local maxima
%     Imax = Iedge > imdilate(Iedge, [1 1 1; 1 0 1; 1 1 1]);
%     Idet = Iedge > 0.7 & Imax;
    subplot(2, 2, 1); imshow(I);
    subplot(2, 2, 2); imshow(Idxy);
    subplot(2, 2, 3); imshow(Iskin);
    subplot(2, 2, 4); imshow(Iedge);
    
    B = I;
end