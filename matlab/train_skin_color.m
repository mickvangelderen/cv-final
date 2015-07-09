addpath('lib');

%%

files = dir('hands/*-mask.png');

hands = cell(1, length(files));
masks = cell(1, length(files));

for fi = 1:length(files)
    filename = regexprep(files(fi).name, '-mask.png$', '');
    masks{fi} = imread(['hands/' files(fi).name]);
    try
        hands{fi} = im2double(imread(['hands/' filename '.png']));
    catch
        try
            hands{fi} = im2double(imread(['hands/' filename '.jpg']));
        catch
            continue
        end
    end
    [mh, mw] = size(masks{fi});
    [hh, hw, ~] = size(hands{fi});
    assert(mh == hh, 'Expected mask to match image size');
    assert(mw == hw, 'Expected mask to match image size');
end

%%    
pixels = cell(length(hands), 1);
allpixels = cell(length(hands), 1);
maskpixels = cell(length(hands), 1);
for i = 1:length(hands)
    hand = reshape(hands{i}, [], 3);
    mask = reshape(masks{i}, [], 1);
    pixels{i} = hand(mask, :);
    allpixels{i} = hand;
    maskpixels{i} = mask;
end
allpixels = cell2mat(allpixels);
maskpixels = cell2mat(maskpixels);

H = cell2mat(pixels);
M = mean(H);
S = cov(H);

Hyiq = rgb2ntsc(H);
Myiq = mean(Hyiq(:, 2:3));
Syiq = cov(Hyiq(:, 2:3));

% X = H(1:8, :);
% X0 = bsxfun(@minus, X, M);
% R = cholcov(S);
% xRinv = X0/R;
% y2 = exp(-0.5*sum(xRinv.^2, 2) - sum(log(diag(R))) - size(S, 1)*log(2*pi)/2)

probs = cell(length(hands), 1);
probpixels = cell(length(hands), 1);
probs2 = cell(length(hands), 1);
prob2pixels = cell(length(hands), 1);

for i = 1:length(hands)
    I = hands{i};
    pixels = reshape(I, [], 3);
    yiq = rgb2ntsc(pixels);
    p = mvnpdf(pixels, M, S);
    probpixels{i} = p;
    probs{i} = reshape(p, size(I, 1), size(I, 2));
    p = mvnpdf(yiq(:, 2:3), Myiq, Syiq);
    prob2pixels{i} = p;
    probs2{i} = reshape(p, size(I, 1), size(I, 2));
end
probpixels = cell2mat(probpixels);
prob2pixels = cell2mat(prob2pixels);

%% Optimzie treshold
L1 = min(probpixels);
H1 = max(probpixels);
range1 = L1:H1;
errors1 = zeros(1, length(range1));
for i = 1:length(range1)
    errors1(i) = sum((probpixels > range1(i)) ~= maskpixels);
end
errors1 = errors1/length(maskpixels);
clf
plot(errors1);
[~, index1] = min(errors1);
fprintf('min treshold: %f\n', range(index1));
L2 = min(prob2pixels);
H2 = max(prob2pixels);

range2 = L2:H2;
errors2 = zeros(1, length(range2));
for i = 1:length(range2)
    errors2(i) = sum((prob2pixels > range2(i)) ~= maskpixels);
end
errors2 = errors2/length(maskpixels);
hold on;
plot(errors2);
xlabel('treshold');
ylabel('error');
legend({'rgb', 'yiq'});
title('Multivariate gaussian skin detection');
[~, index2] = min(errors2);
fprintf('min treshold: %f\n', range(index2));
printfigure('path', 'media/skin_detect_gauss_treshold.pdf', ...
    'dimensions', [12 8]);
%%
clf
for i = 1:length(probs)
    subplot(7, 9, 3*i - 2);
    imshow(hands{i});
    subplot(7, 9, 3*i - 1);
    imshow(probs{i} > 45);
    subplot(7, 9, 3*i - 0);
    imshow(probs2{i} > 155);
end
%%

clear cam;
cam = webcam;

while cam.isvalid
    I = im2double(cam.snapshot);
    pixels = reshape(I, [], 3);
    probs = mvnpdf(pixels, M, S);
    O = reshape(probs, size(I, 1), size(I, 2));
    m = medfilt2(O > 10, [3 3]);
    imshow(I.*repmat((0.2 + 0.8*m), [1 1 3]));
end