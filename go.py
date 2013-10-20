import pandas as pd, numpy as np

df = pd.read_csv('bats2013_activities.csv',index_col=["SAMPN","PERNO"])

df['MODE'] = df.MODE.map({1:3,2:2,3:4,4:4,5:5,6:5,7:5,8:4,9:5,10:5,11:1,12:4,13:1,14:1,15:1,16:1,17:1,18:1,19:1,20:1,21:1,22:1,23:1,24:1,25:1,26:1,27:1,28:1,29:1})

df.XCORD += np.random.random(len(df.index))*.0005
df.YCORD += np.random.random(len(df.index))*.0005
df = df[['INCOM','AGE','AREA','MODE','ARR_HR','XCORD','YCORD']]
df.MODE = df.MODE.fillna(6)
df = df[df.INCOM<=10]
df = df[df.AGE<=100]
print df.describe()
print df.AREA.value_counts()

regions = {
22: "bayarea",
30: "losangeles",
25: "sacramento",
28: "sandiego",
3:  "monterey",
12: "bakersfield",
8:  "fresno"
}

for region in regions.items():
  tmpdf = df[df.AREA == region[0]]
  del tmpdf["AREA"]
  for name, group in tmpdf.groupby('INCOM'):
    del group["INCOM"]  
    group.to_csv('%s/minibats%s.csv'%(region[1],name),index_label=['HHID','PERID'])
