import os
from datetime import datetime
import zipfile

def main():
    suffix = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')

    zf = zipfile.ZipFile('dist/src-{}.zip'.format(suffix), 'w')

    for dirname, subdirs, files in os.walk('src'):
        zf.write(dirname)
        for filename in files:
            zf.write(os.path.join(dirname, filename))

    zf.close()


if __name__ == '__main__':
    main()
