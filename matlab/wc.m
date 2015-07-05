if (isempty(cam))
    cam = webcam;
end

while (true)
    img = snapshot(cam);
    image(img);
    drawnow;
end