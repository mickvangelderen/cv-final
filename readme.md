# Computer Vision - Final Project

[Report](CV_Final_Project_Hand_Tracking.pdf)

[Webcam & WebGL experiments](https://mickvangelderen.github.io/cv-final/)

The actual project was written in MATLAB. 

## Papers

Below are some ugly summaries I wrote of the papers I read. 
```
@article{yoon2001hand,
  title={Hand gesture recognition using combined features of location, angle and velocity},
  author={Yoon, Ho-Sub and Soh, Jung and Bae, Younglae J and Yang, Hyun Seung},
  journal={Pattern recognition},
  volume={34},
  number={7},
  pages={1491--1501},
  year={2001},
  publisher={Elsevier}
}
```
### detection
iq from yiq color space, 4x4 histogram, Swain/Ballard intersection, trained interactively
find connected regions, remove small regions
otsu threshold to adapt to lighting
location priors + previous detection + hand region size to remove face region

### tracking
incorporate previous detection in determining hand region

### pose estimation
HMM using location, angle and velocity as inputs
```
@article{ng2002real,
  title={Real-time gesture recognition system and application},
  author={Ng, Chan Wah and Ranganath, Surendra},
  journal={Image and Vision computing},
  volume={20},
  number={13},
  pages={993--1007},
  year={2002},
  publisher={Elsevier}
}
```
### detection
Background subtraction
Gaussian skin model, adapt to mean of detected hands in last 3 frames
Wrist cropping by searching big change in detected region contour. 

### tracking
Adapt skin model
Kalman filter to track hand position

### pose estimation
Fourier descriptors into RBF network -> pose likelihood for 5 poses
Combine poses of 2 hands with another RBF network.
Gesture recoginition through HMM and recurrent neural network, inputs: location change and pose vectors
```
@article{chen2003hand,
  title={Hand gesture recognition using a real-time tracking method and hidden Markov models},
  author={Chen, Feng-Sheng and Fu, Chih-Ming and Huang, Chung-Lin},
  journal={Image and vision computing},
  volume={21},
  number={8},
  pages={745--758},
  year={2003},
  publisher={Elsevier}
}
```
### detection
motion detection
skin color detection
edge detection
background subtraction

### tracking

### pose estimation

```
@inproceedings{chen2007real,
  title={Real-time vision-based hand gesture recognition using haar-like features},
  author={Chen, Qing and Georganas, Nicolas D and Petriu, Emil M},
  booktitle={Instrumentation and Measurement Technology Conference Proceedings, 2007. IMTC 2007. IEEE},
  pages={1--6},
  year={2007},
  organization={IEEE}
}
```
### detection
Haar-like features

### tracking
None

### pose estimation
Multiple Viola&Jones cascades for 4 postures
```
@incollection{maccormick2000partitioned,
  title={Partitioned sampling, articulated objects, and interface-quality hand tracking},
  author={MacCormick, John and Isard, Michael},
  booktitle={Computer Vision—ECCV 2000},
  pages={3--19},
  year={2000},
  publisher={Springer}
}
```
### detection
?

### tracking
Particle filter.

### pose estimation
Single pose.
```
@incollection{oikonomidis2011markerless,
  title={Markerless and efficient 26-dof hand pose recovery},
  author={Oikonomidis, Iasonas and Kyriazis, Nikolaos and Argyros, Antonis A},
  booktitle={Computer Vision--ACCV 2010},
  pages={744--757},
  year={2011},
  publisher={Springer}
}
```
### detection
Multi-camera skin and edge detection

### tracking

### pose estimation
fit 3d model using particle swarm optimization

```
@inproceedings{oikonomidis2012tracking,
  title={Tracking the articulated motion of two strongly interacting hands},
  author={Oikonomidis, Iasonas and Kyriazis, Nikolaos and Argyros, Antonis A},
  booktitle={Computer Vision and Pattern Recognition (CVPR), 2012 IEEE Conference on},
  pages={1862--1869},
  year={2012},
  organization={IEEE}
}
```
### detection

### tracking

### pose estimation
```
@inproceedings{shimada2001real,
  title={Real-time 3D hand posture estimation based on 2D appearance retrieval using monocular camera},
  author={Shimada, Nobutaka and Kimura, Kousuke and Shirai, Yoshiaki},
  booktitle={Recognition, Analysis, and Tracking of Faces and Gestures in Real-Time Systems, 2001. Proceedings. IEEE ICCV Workshop On},
  pages={23--30},
  year={2001},
  organization={IEEE}
}
```
### detection
brute force countour matching

### tracking

### pose estimation

```
@inproceedings{van2011combining,
  title={Combining RGB and ToF cameras for real-time 3D hand gesture interaction},
  author={Van den Bergh, Michael and Van Gool, Luc},
  booktitle={Applications of Computer Vision (WACV), 2011 IEEE Workshop on},
  pages={66--72},
  year={2011},
  organization={IEEE}
}
```
### detection

### tracking

### pose estimation
```
@article{jones2002statistical,
  title={Statistical color models with application to skin detection},
  author={Jones, Michael J and Rehg, James M},
  journal={International Journal of Computer Vision},
  volume={46},
  number={1},
  pages={81--96},
  year={2002},
  publisher={Springer}
}
```
### detection
general skin, adapted to color of detected face
depth threshold...

### tracking

### pose estimation

```
@inproceedings{sudderth2004visual,
  title={Visual hand tracking using nonparametric belief propagation},
  author={Sudderth, Andre B and Mandel, Michael and Freeman, William T and Willsky, Alan S and others},
  booktitle={Computer Vision and Pattern Recognition Workshop, 2004. CVPRW'04. Conference on},
  pages={189--189},
  year={2004},
  organization={IEEE}
}
```
### detection
used in argyros2004real
Chamfer distance matching (kind of sum of distances to nearest neighbours on input edge image vs prototype edge image)
Single gaussian rgb skin model

### tracking

### pose estimation
Kinematic model
Gaussian belief propagation something approximated solutions with Monte Carlo method

```
@incollection{argyros2004real,
  title={Real-time tracking of multiple skin-colored objects with a possibly moving camera},
  author={Argyros, Antonis A and Lourakis, Manolis IA},
  booktitle={Computer Vision-ECCV 2004},
  pages={368--379},
  year={2004},
  publisher={Springer}
}
```
### detection

### tracking

### pose estimation

## Surveys
```
@article{rautaray2015vision,
  title={Vision based hand gesture recognition for human computer interaction: a survey},
  author={Rautaray, Siddharth S and Agrawal, Anupam},
  journal={Artificial Intelligence Review},
  volume={43},
  number={1},
  pages={1--54},
  year={2015},
  publisher={Springer}
}
```

```
@article{erol2007vision,
  title={Vision-based hand pose estimation: A review},
  author={Erol, Ali and Bebis, George and Nicolescu, Mircea and Boyle, Richard D and Twombly, Xander},
  journal={Computer Vision and Image Understanding},
  volume={108},
  number={1},
  pages={52--73},
  year={2007},
  publisher={Elsevier}
}
```
### detection
skin color segmentation
background subtraction
depth camera/stereo camera
deformable template models
cascaded classifier on image patches, requires immense dataset
binary tree of classifiers
semi-supervised learning
### tracking
many
### pose estimation
many


## Extra
```
@inproceedings{mittal2011hand,
  title={Hand detection using multiple proposals.},
  author={Mittal, Arpit and Zisserman, Andrew and Torr, Philip HS},
  booktitle={BMVC},
  pages={1--11},
  year={2011},
  organization={Citeseer}
}
```
Hand dataset

```
@article{canny1986computational,
  title={A computational approach to edge detection},
  author={Canny, John},
  journal={Pattern Analysis and Machine Intelligence, IEEE Transactions on},
  number={6},
  pages={679--698},
  year={1986},
  publisher={IEEE}
}
```
Canny edge detection

```
@inproceedings{scheuermann2007efficient,
  title={Efficient histogram generation using scattering on GPUs},
  author={Scheuermann, Thorsten and Hensley, Justin},
  booktitle={Proceedings of the 2007 symposium on Interactive 3D graphics and games},
  pages={33--37},
  year={2007},
  organization={ACM}
}
```
(Local) histogram calculation on the GPU

```
@inproceedings{fredembach2006simple,
  title={Simple Shadow Remova},
  author={Fredembach, Clement and Finlayson, Graham},
  booktitle={Pattern Recognition, 2006. ICPR 2006. 18th International Conference on},
  volume={1},
  pages={832--835},
  year={2006},
  organization={IEEE}
}
```
Remove shadows to reduce image dissimilarity caused by lighting

```
@article{swain1991color,
  title={Color indexing},
  author={Swain, Michael J and Ballard, Dana H},
  journal={International journal of computer vision},
  volume={7},
  number={1},
  pages={11--32},
  year={1991},
  publisher={Springer}
}
```
Histogram differences: Sum of overlap between histograms(i.e. min)/Sum of model histogram
