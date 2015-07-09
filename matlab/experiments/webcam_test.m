if (isempty(cam))
    cam = webcam;
end

image_handle = imshow(cam.snapshot);

while cam.isvalid
    I = cam.snapshot;
    set(image_handle, 'CData', I);
    drawnow;
end