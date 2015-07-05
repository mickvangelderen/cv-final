
hands = {
    im2double(imread('hands/0.png')) ...
    im2double(imread('hands/1.png')) ...
    im2double(imread('hands/2.png')) ...
    im2double(imread('hands/3.png')) ...
    im2double(imread('hands/4.png')) ...
    im2double(imread('hands/5.png')) ...
};

masks = {
    imread('hands/0-mask.png') ...
    imread('hands/1-mask.png') ...
    imread('hands/2-mask.png') ...
    imread('hands/3-mask.png') ...
    imread('hands/4-mask.png') ...
    imread('hands/5-mask.png') ...
};

for i = 1:length(hands)
    hands{i} = rgb2ntsc(hands{i});
end

pixels = cell(length(hands), 1);

for i = 1:length(hands)
    I = reshape(hands{i}, [], 3);
    M = reshape(masks{i}, [], 1);
    pixels{i} = I(M, :);
end

H = cell2mat(pixels);
H = H(:, 2:3);
size(H)
M = mean(H);
S = cov(H);

% X = H(1:8, :);
% X0 = bsxfun(@minus, X, M);
% R = cholcov(S);
% xRinv = X0/R;
% y2 = exp(-0.5*sum(xRinv.^2, 2) - sum(log(diag(R))) - size(S, 1)*log(2*pi)/2)

for i = 1:length(hands)
    I = hands{i};
    pixels = reshape(I, [], 3);
    probs = mvnpdf(pixels(:, 2:3), M, S);
    C = reshape(probs, size(I, 1), size(I, 2));
    subplot(2, 3, i);
    imshow(C, [min(probs) max(probs)]);
end
