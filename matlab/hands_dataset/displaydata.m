 
% This function displays training data with annotations overlaid. Other
% datasets could be seen in the same way by changing the paths of image
% and annotation directories
uf = dir('training_data/images/*.jpg');
for i = 1:length(uf)
    dot = strfind(uf(i).name,'.');
    imname = uf(i).name(1:dot-1);
    load(['training_data/annotations/' imname '.mat']);
    im = imread(['training_data/images/' uf(i).name]);
%     imshow(im);
    [height, width, depth] = size(im);
    for j = 1:length(boxes)
        box = boxes{j};
        
        xmin = max(1, round(min([box.a(2), box.b(2), box.c(2), box.d(2)])));
        xmax = min(width - 1, round(max([box.a(2), box.b(2), box.c(2), box.d(2)])));
        ymin = max(1, round(min([box.a(1), box.b(1), box.c(1), box.d(1)])));
        ymax = min(height - 1, round(max([box.a(1), box.b(1), box.c(1), box.d(1)])));

        if (xmax - xmin)*(ymax - ymin) < 30*30; continue; end
        
        patch = im(ymin:ymax, xmin:xmax, :);
        
        imwrite(patch, ['hands/' imname '_' num2str(j) '.jpg']);
    end
    fprintf('%d/%d\n', i, length(uf));
end