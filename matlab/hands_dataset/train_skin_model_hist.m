
% files = dir('hands/*.jpg');
% nbins = 16;
% edges = (0:nbins)/nbins;
% hists = zeros(length(files), 3*nbins);
% 
% for i = 1:length(files)
%     im = im2double(imread(['hands/' files(i).name]));
%     hists(i, :) = [...
%         histcounts(im(:, :, 1), edges, 'Normalization','probability'), ...
%         histcounts(im(:, :, 2), edges, 'Normalization','probability'), ...
%         histcounts(im(:, :, 3), edges, 'Normalization','probability') ...
%     ];
% end

%%
% This function displays training data with annotations overlaid. Other
% datasets could be seen in the same way by changing the paths of image
% and annotation directories

mhists = mean(hists);
shists = hists(randperm(size(hists, 1), 500), :);

uf = dir('training_data/images/*.jpg');
for i = 1:50:length(uf)
    im = im2double(imread(['training_data/images/' uf(i).name]));
    [height, width, ~] = size(im);
    probs = zeros(height, width);
    for iy = 1:10:height
        for ix = 1:10:width
            patch = im( ...
                max(1, iy - 10):min(height, iy + 10), ...
                max(1, ix - 10):min(width, ix + 10), ...
                : ...
            );
            h = [...
                histcounts(patch(:, :, 1), edges), ...
                histcounts(patch(:, :, 2), edges), ...
                histcounts(patch(:, :, 3), edges) ...
            ]/(size(patch, 1)*size(patch, 2));
            probs(iy, ix) = 1/min(sum(bsxfun(@minus, shists, h).^2, 2));
        end
    end
    subplot(1, 2, 1); imshow(im);
    subplot(1, 2, 2); imshow(probs, [min(probs(:)) max(probs(:))]);
    pause;
    fprintf('%d/%d\n', i, length(uf));
end