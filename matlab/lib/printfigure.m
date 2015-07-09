function printfigure(varargin)

% Define named options
options = struct();
options.figure = gcf;
options.path = 'figure.pdf';
options.format = '-dpdf';
options.dimensions = [];
options.units = 'centimeters';
keys = fieldnames(options);

% Parse the unnamed options. 
f = varargin{1};
if ishandle(varargin{1})
    options.figure = f;
    varargin = varargin(2:end);
end

% Parse the named options. 
even = @(n) mod(n, 2) == 0;
assert(even(length(varargin)), ...
    'Please provide a matching number of key/value arguments.');
for pair = reshape(varargin, 2, [])
    key = lower(pair{1});
    assert(any(strcmp(key, keys)), ...
        '%s is not a recognized parameter name.', pair{1});
    options.(key) = pair{2};
end

% Modify the figure. 
f = options.figure;

if ~isempty(options.dimensions)
    cfu = f.Units; % save old units
    cfp = f.Position; % save old position
    cfpu = f.PaperUnits; % save old paper units
    f.Units = options.units;
    f.Position = [0 0 options.dimensions];
    f.PaperUnits = options.units;
    f.PaperSize = options.dimensions;
    f.PaperPosition = [0 0 options.dimensions];
end

% Make axis same size as the to-be-printed figure. 
allAxes = findall(f, 'type', 'axes');

if length(allAxes) == 1
    a = allAxes(1);
    drawnow; % draw so we get the right TightInset
    t = a.TightInset;
    cap = a.Position; % save old position
    a.Position = [t(1:2), 1 - t(1) - t(3), 1 - t(2) - t(4)];
end

% Print. 
print(f, options.format, options.path)

% Restore old settings. 
if ~isempty(options.dimensions)
    f.Units = cfu;
    f.Position = cfp;
    f.PaperUnits = cfpu;
end

if length(allAxes) == 1
    a.Position = cap;
end

end