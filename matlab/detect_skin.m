function mask = detect_skin(image)

M = [0.4793    0.3149    0.3030];

S = [ ...
    0.0308    0.0269    0.0269; ...
    0.0269    0.0249    0.0251; ...
    0.0269    0.0251    0.0272; ...
];

T = 30;

pixels = reshape(image, [], 3);
probs = mvnpdf(pixels, M, S) > T;
mask = reshape(probs, size(image, 1), size(image, 2));

