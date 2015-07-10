
files = dir('hands/*.jpg');
means = zeros(length(files), 3);
for i = 1:length(files)
    im = im2double(imread(['hands/' files(i).name]));
    pixels = reshape(im, [], 3);
    means(i, :) = mean(pixels);
end

%%

scatter3(means(:, 1), means(:, 2), means(:, 3));

%%
% This function displays training data with annotations overlaid. Other
% datasets could be seen in the same way by changing the paths of image
% and annotation directories
M = mean(means);
S = cov(means);

uf = dir('training_data/images/*.jpg');
for i = 1:50:length(uf)
    im = im2double(imread(['training_data/images/' uf(i).name]));
    pixels = reshape(im, [], 3);
    probs = mvnpdf(pixels, M, S);\
    
    % exp(-0.5*sum((pixels*S).^2, 2));
    subplot(1, 2, 1); imshow(im);
    subplot(1, 2, 2); imshow(reshape(probs, size(im, 1), size(im, 2)), [min(probs(:)) max(probs(:))]);
    pause;
    fprintf('%d/%d\n', i, length(uf));
end