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

%% Compute histograms for each image
pixels = cell(length(hands), 1);
hists = cell(length(hands), 1);
nbins = 32;
edges = (0:nbins)/nbins;
imin = -0.5957; imax = 0.5957; iedges = imin + edges*(imax - imin);
qmin = -0.5226; qmax = 0.5226; qedges = imin + edges*(qmax - qmin);

for i = 1:length(hands)
    I = reshape(hands{i}, [], 3);
    M = reshape(masks{i}, [], 1);
    pixels{i} = I(M, :);
    yiq = rgb2ntsc(pixels{i});
    hists{i} = [ ...
        histcounts(yiq(:, 2), iedges) ...
        histcounts(yiq(:, 3), qedges) ...
    ];
    hists{i} = hists{i}/sum(hists{i});
    subplot(5, 5, i); stem(hists{i});
end

pixels = cell2mat(pixels);
hists = cell2mat(hists);

%% Compute max Swain histogram similarity between 8x8 window and all trained hist
probs = cell(length(hands), 1);
for i = 1:length(hands)
    I = rgb2ntsc(hands{i});
    [height, width, ~] = size(I);
    p = zeros(height, width);
    for yi = 1:1:height
        for xi = 1:1:width
            patch = I( ...
                max(1, yi - 8):min(height, yi + 8), ...
                max(1, xi - 8):min(width, xi + 8), ...
                : ...
            );
            h = [ ...
                histcountsmex(patch(:, :, 2), iedges) ...
                histcountsmex(patch(:, :, 3), qedges) ...
            ];
            h = h/sum(h);
            % Get the maximum similarity between the current patch' histogram
            % and all trained histograms.
            h = repmat(h, [size(hists, 1) 1]);
            
            p(yi, xi) = max(sum(min(h, hists), 2));
        end
    end
    fprintf('%d/%d\n', i, length(hands));
    probs{i} = p;
end
%% Compute Swain histogram similarity between 8x8 window and mean trained hist
probs2 = cell(length(hands), 1);
mhists = mean(hists);
for i = 1:length(hands)
    I = rgb2ntsc(hands{i});
    [height, width, ~] = size(I);
    p = zeros(height, width);
    for yi = 1:1:height
        for xi = 1:1:width
            patch = I( ...
                max(1, yi - 8):min(height, yi + 8), ...
                max(1, xi - 8):min(width, xi + 8), ...
                : ...
            );
            h = [ ...
                histcountsmex(patch(:, :, 2), iedges) ...
                histcountsmex(patch(:, :, 3), qedges) ...
            ];
            h = h/sum(h);
            % Get the maximum similarity between the current patch' histogram
            % and the average of all trained histograms.
            p(yi, xi) = sum(min(h, mhists), 2);
        end
    end
    fprintf('%d/%d\n', i, length(hands));
    probs2{i} = p;
end
%% Plot the results
clf
for i = 1:length(probs)
    subplot(7, 9, 3*i - 2);
    imshow(hands{i});
    subplot(7, 9, 3*i - 1);
    imshow(probs{i});
    subplot(7, 9, 3*i - 0);
    imshow(probs2{i});
end