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

    logging.info(f'start handling command = {command}')

    action = command['action']

    logging.info(f'action = {action}')

    if action == 'start':
        if rpc_client is not None:
            logging.info('RPC Client already running', rpc_client)
            return

        try:
            data = command['data']

            logging.debug(f'Start connect with data: {data}')

            rpc_client = Presence(data['appId'])
            logging.debug('Connecting to RPC Client')

            rpc_client.connect()

            start_time = (int(time.time()))

            rpc_client.update(
                details=data['details'],
                large_image=data['largeImage'],
                small_image=data['smallImage'],
                small_text=data['smallText'],
                large_text=data['largeText'],
                start=start_time,
            )

            logging.info('RPC Client connected and update data')

            send_change_status('start')

        except DiscordNotFound as e:
            logging.debug('Discord Not Found', e)
            rpc_client = None
        except InvalidPipe as e:
            logging.debug('Invalid Pipe', e)
        except Exception as e:
            logging.debug('Exception', e)

    if action == 'stop':
        if rpc_client is None:
            logging.debug('RPC Client not running', rpc_client)

        logging.info('Start stopping RPC Client')

        try:
            logging.debug('StartDisconnecting')
            rpc_client.close()
            rpc_client = None
            logging.debug('RPC Client disconnected')
            send_change_status('stop')

        except Exception as e:
            logging.debug('Error', e)
            rpc_client.close()
            rpc_client = None

def send_change_status(status:str):
    logging.info(f'send change status: {status}')
    message = json.dumps({'command': status})
    print(message, flush=True)
    logging.debug(f'check message: {json.loads(message)}')
    sys.stdout.flush()


def main():
    logging.info('Starting Discord RPC script')

    while True:
        line = sys.stdin.readline()

        if not line:
            logging.warning('Discord RPC script exiting')
            break

        line = line.strip()
        if not line:
            logging.debug('Discord RPC script exiting')
            break

        if line:
            logging.info("Enter in start method coz main take data")
            try:
                command = json.loads(line)
                handle_command(command)
            except Exception as e:
                logging.debug('Exception', e)
                sys.stdout.flush()


if __name__ == '__main__':
    main()