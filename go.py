import pandas as pd

df = pd.read_csv('bats2013MTC_activities.csv')

df['MODE'] = df.MODE.map({1:3,2:2,3:4,4:4,5:5,6:5,7:5,8:4,9:5,10:5,11:1,12:4,13:1,14:1,15:1,16:1,17:1,18:1,19:1,20:1,21:1,22:1,23:1,24:1,25:1,26:1,27:1,28:1,29:1})

df = df[df.HCITY == "SAN FRANCISCO"]
df = df[['SAMPN','INCOM','PERNO','PLANO','APURP1','MODE','ARR_HR','XCORD','YCORD','AGE']]
df = df.dropna(how='any')
df = df[df.INCOM<=10]
df = df[df.AGE<=100]
print df.describe()
df.to_csv('minibats.csv',index=False)
