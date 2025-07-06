import sys
import os

lib_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'python'))
print('lib_path:', lib_path)
sys.path.insert(0, lib_path)
print('sys.path:', sys.path)

from pypresence import Presence, DiscordNotFound, InvalidPipe
import time
import json
import logging

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    filename='discord_rpc.log'
)

rpc_client = None
start_time = None


def handle_command(command):
    global rpc_client, start_time

    try:
        logging.info(f'Received command: {command}')

        if command['action'] == 'start':
            data = command['data']
            logging.info(f'Starting RPC with data: {data}')

            if rpc_client is not None:
                try:
                    logging.info('Closing existing RPC connection')
                    rpc_client.close()
                except Exception as e:
                    logging.error(f'Error closing existing connection: {e}')

            try:
                logging.info(f'Creating new Presence with app ID: {data["appId"]}')
                rpc_client = Presence(data['appId'])

                logging.info('Connecting to Discord...')
                rpc_client.connect()
                logging.info('Successfully connected to Discord')

                start_time = int(time.time())
                logging.info(f'Setting start time: {start_time}')

                logging.info('Updating presence with data...')
                rpc_client.update(
                    details=data['details'],
                    large_image=data['largeImage'],
                    large_text=data['largeText'],
                    small_image=data['smallImage'],
                    small_text=data['smallText'],
                    start=start_time
                )
                logging.info('Presence updated successfully')

                print(json.dumps({'success': True}))
                sys.stdout.flush()

            except DiscordNotFound:
                logging.error('Discord not found')
                print(json.dumps({'success': False, 'error': 'Discord not found'}))
                sys.stdout.flush()
            except InvalidPipe:
                logging.error('Invalid pipe (Discord not running?)')
                print(json.dumps({'success': False, 'error': 'Invalid pipe'}))
                sys.stdout.flush()
            except Exception as e:
                logging.error(f'Failed to connect: {str(e)}')
                print(json.dumps({'success': False, 'error': str(e)}))
                sys.stdout.flush()

        elif command['action'] == 'stop':
            logging.info('Received stop command')
            if rpc_client is not None:
                try:
                    logging.info('Closing RPC connection')
                    rpc_client.close()
                    rpc_client = None
                    start_time = None
                    logging.info('RPC disconnected successfully')
                    print(json.dumps({'success': True}))
                except Exception as e:
                    logging.error(f'Error disconnecting: {e}')
                    print(json.dumps({'success': False, 'error': str(e)}))
            else:
                logging.warning('No active connection to close')
                print(json.dumps({'success': False, 'error': 'No active connection'}))
            sys.stdout.flush()

    except Exception as e:
        logging.error(f'Error handling command: {e}')
        print(json.dumps({'success': False, 'error': str(e)}))
        sys.stdout.flush()


def main():
    logging.info('Starting Discord RPC script')
    while True:
        try:
            line = sys.stdin.readline()
            if not line:
                logging.info('Input stream closed')
                break

            logging.debug(f'Received line: {line.strip()}')
            command = json.loads(line)
            handle_command(command)

        except Exception as e:
            logging.error(f'Error in main loop: {e}')
            print(json.dumps({'success': False, 'error': str(e)}))
            sys.stdout.flush()


if __name__ == '__main__':
    main()