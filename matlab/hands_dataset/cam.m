clear cam;
cam = webcam;
cam.Resolution = '160x120';

B = im2double(cam.snapshot);

while cam.isvalid
    I = im2double(cam.snapshot);
    imshow(mean(abs(I - B), 3));
    B = I;
end