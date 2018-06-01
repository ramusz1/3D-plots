import numpy as np

count = 12
r = 0.03
depth = -1.0

alpha = np.radians( 360 / count)

c, s = np.cos(alpha), np.sin(alpha)
Mat = np.array([[c,-s], [s, c]])

print(Mat)

v = np.array([ 0, -r ])

for i in range(count + 1):
  print('{0}, {1}, {2},'.format(v[0], v[1],depth))
  v = Mat.dot(v)

