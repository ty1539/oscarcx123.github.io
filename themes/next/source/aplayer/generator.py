import csv
import json

filename = 'musicDB.csv'
repo_url = 'https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/music/'

# 从csv读取name和artist并去掉表头
with open(filename) as f:
    reader = csv.reader(f)
    music_list = list(reader)[1:]

# 生成JSON对象
result = []
for i in range(len(music_list)):
    data = {}
    data['name'] = music_list[i][0]
    data['artist'] = music_list[i][1]
    data['url'] = repo_url + 'song/' + music_list[i][0] + '.mp3'
    data['cover'] = repo_url + 'cover/' + music_list[i][0] + '.jpg'
    result.append(data)

# 写入music.js
with open('music.js', 'w') as f:
    f.writelines([
        "const ap = new APlayer({" + "\n",
        "    container: document.getElementById('aplayer')," + "\n",
        "    fixed: true," + "\n",
        "    autoplay: false," + "\n",
        "    order: 'random'," + "\n",
        "    audio: ",
    ])
    json.dump(result, f, ensure_ascii=False, sort_keys=False, indent=4)
    f.write("});")